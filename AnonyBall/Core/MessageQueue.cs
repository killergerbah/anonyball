using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AnonyBall.Core;

namespace AnonyBall.Core
{
    public class MessageQueue
    {
        private static Queue<Message> queue;
        
        static MessageQueue(){
            queue = new Queue<Message>();
        }

        public void Enqueue(string text, string connectionId)
        {
            queue.Enqueue(new Message(text, new User(connectionId)));
        }

        public void Enqueue(Message message)
        {
            queue.Enqueue(message);
        }

        public Message Dequeue()
        {
            return queue.Dequeue();
        }

        public bool IsEmpty()
        {
            return !queue.Any();
        }
    }
}