using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnonyBall.Core
{
    public class User
    {
        public string ConnectionId { get; set; }
        public User(string connectionId)
        {
            ConnectionId = connectionId;
        }
        public override int GetHashCode()
        {
            return ConnectionId.GetHashCode();
        }
        public override bool Equals(System.Object obj)
        {
            var user = obj as User;
            if ((object)user == null)
                return false;
            return user.ConnectionId == ConnectionId;
        }
        public bool Equals(User user)
        {
            return user.ConnectionId == ConnectionId;
        }
    }
}