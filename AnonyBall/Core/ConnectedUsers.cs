using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnonyBall.Core
{
    public class ConnectedUsers
    {
        public static HashSet<User> UserSet { get; private set; }
        static ConnectedUsers()
        {
            UserSet = new HashSet<User>();
        }
        public void AddUser(User user)
        {
            UserSet.Add(user);
        }
        public void RemoveUser(User user)
        {
            UserSet.Remove(user);
        }
        public bool Contains(User user)
        {
            return UserSet.Contains(user);
        }
        public int Count()
        {
            return UserSet.Count;
        }
    }
}