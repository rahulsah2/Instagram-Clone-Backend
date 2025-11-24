import jwt from "jsonwebtoken";
import { Server as IOServer, Socket } from "socket.io";

import User from "../models/user.model";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import AppError from "../utils/AppError";

interface SocketData {
  userId?: string;
}

export default function initSockets(httpServer: any) {
  const io = new IOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // userId -> socket.id mapping (simple). For horizontal scaling use Redis adapter.
  const online = new Map<string, string>();

  io.use((socket: Socket & { data: SocketData }, next) => {
    // Simple JWT token passed as query token or in auth payload
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const payload = jwt.verify(
        String(token),
        process.env.JWT_SECRET as string
      ) as any;

      socket.data.userId = payload.id;
      return next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket: Socket & { data: SocketData }) => {
    const userId = socket.data.userId!;

    // Log the connected user
    (async () => {
      try {
        const user = await User.findById(userId).select("name email");
        console.log(`User ${user?.name} (${userId}) connected`);
      } catch (error) {
        console.error(`Failed to fetch user for logging: ${userId}`);
      }
    })();

    online.set(userId, socket.id);

    // join personal room
    await socket.join(userId);

    socket.on("join-conversation", (conversationId: string) => {
      socket.join(conversationId);
    });

    // client -> server: send message
    socket.on("send-message", async (payload) => {
      try {
        const { receiverId, message } = payload;
        const participants = [userId.toString(), receiverId.toString()].sort();

        const conversation = await Conversation.findOneAndUpdate(
          {
            isGroup: false,
            participants,
          },
          {
            $setOnInsert: {
              participants,
              isGroup: false,
            },
          },
          {
            new: true,
            upsert: true,
          }
        );

        const newMessage = new Message({
          conversation: conversation._id,
          sender: userId,
          text: message,
        });

        await newMessage.save();

        io.to(receiverId).emit("receive-message", newMessage);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.log("Error in send-message:", errorMessage);
        socket.emit("error", {
          message: "Unable to send message: " + errorMessage,
        });
      }
    });

    socket.on(
      "typing", async (data: { conversationId: string; typing: boolean }) => {
        try {
          // find the correct conversation by ID
          const convo = await Conversation.findById(data.conversationId).select(
            "participants"
          );

          if (!convo) throw new AppError("Conversation not found");

          // find other user
          const receiverId = convo.participants.find(
            (id) => id.toString() !== userId.toString()
          );

          if (!receiverId) throw new AppError("Receiver not found");

          const receiver = receiverId.toString();

          socket.to(receiver).emit("user-typing", {
            conversation: data.conversationId,
            typing: data.typing,
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          socket.emit("error", { message: "Typing error: " + errorMessage });
        }
      } 
    ); 

    socket.on("disconnect", () => {
      (async () => {
        try {
          const user = await User.findById(userId).select("name email");
          console.log(`User ${user?.name} (${userId}) disconnected`);
        } catch (error) {
          console.error(`Failed to fetch user for logging: ${userId}`);
        }
      })();
      online.delete(userId);
      socket.leave(userId);
    });
  });

  return io;
  }