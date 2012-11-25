using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnonyBall.Core
{
    public class Message
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string ConnectionId { get; set; }
        private static Random _rand;

        static Message()
        {
            _rand = new Random();
        }

        public Message(string text, string connectionId)
        {
            Text = text;
            Id = _rand.Next();
            ConnectionId = connectionId;
        }
    }
}