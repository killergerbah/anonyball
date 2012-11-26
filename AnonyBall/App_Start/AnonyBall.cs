using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AnonyBall.Core;
using System.Threading.Tasks;

namespace AnonyBall.App_Start
{
    public class AnonyBall : Hub
    {
        public static MessageQueue messageQueue;
        public static ConnectedUsers connectedUsers;
        private static TimeSpan TIMEOUT = TimeSpan.FromSeconds(20);
        static AnonyBall()
        {
            messageQueue = new MessageQueue();
            connectedUsers = new ConnectedUsers();
        }

        public void AddMessage(string text)
        {
            messageQueue.Enqueue(text, Context.ConnectionId);
        }

        public Message GetMessage()
        {
            while (!messageQueue.IsEmpty()) 
            {
                var message = messageQueue.Dequeue();
                //Only return message from someone still connected
                //and that has not timed out
                if (connectedUsers.Contains(message.User) && DateTime.Now.Subtract(message.Date) < TIMEOUT) 
                {
                    return message;
                }
            }
            return null;
        }

        public void Reply(Message message, string reply){
            Clients.Client(message.User.ConnectionId).addReply(reply, message.Id);
        }

        public override Task OnConnected()
        {
            connectedUsers.AddUser(new User(Context.ConnectionId));
            return Clients.All.populateNumUsers(connectedUsers.Count());
        }
        public override Task OnDisconnected()
        {
            connectedUsers.RemoveUser(new User(Context.ConnectionId));
            return Clients.All.populateNumUsers(connectedUsers.Count());
        }
    }
}