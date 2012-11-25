using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AnonyBall.Core;

namespace AnonyBall.App_Start
{
    public class AnonyBall : Hub
    {
        public static MessageQueue messageQueue;

        static AnonyBall()
        {
            messageQueue = new MessageQueue();
        }

        public void AddMessage(string text)
        {
            messageQueue.Enqueue(text, Context.ConnectionId);
        }

        public Message GetMessage()
        {
            if (!messageQueue.IsEmpty()) 
                return messageQueue.Dequeue();
            return null;
        }

        public void Reply(Message message, string reply){
            Clients.Client(message.ConnectionId).addReply(reply, message.Id);
        }
    }
}