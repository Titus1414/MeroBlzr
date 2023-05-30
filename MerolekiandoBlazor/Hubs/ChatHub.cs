using Microsoft.AspNetCore.SignalR;

namespace MerolekiandoBlazor.Hubs
{
    public class ChatHub : Hub
    {
        private static Dictionary<string, string> Users = new Dictionary<string, string>();
        public override async Task OnConnectedAsync()
        {
            //string username = Context.GetHttpContext().Request.Query["username"];
            //Users.Add(Context.ConnectionId, username);
            //await AddMessageToChat(string.Empty, $"{username} joined!", Context.ConnectionId);

            var connectionId = Context.ConnectionId;



            //var httpContext = Context.GetHttpContext();
            //var token = httpContext.Request.Cookies["userId"];
            //var tokeasdfn = httpContext.Request.Cookies["ID"];


            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            //string username = Users.FirstOrDefault(u => u.Key == Context.ConnectionId).Value;
            //await AddMessageToChat(string.Empty, $"{username} left!", Context.ConnectionId);
        }
        public async Task AddMessageToChat(string user, string message, string conn)
        {
            //if (Context.ConnectionId == conn)
            //{
            //    message = $"<div class=\"d-flex flex-row justify-content-start\">\r\n  <img src=\"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp\"\r\n  alt=\"avatar 1\" style=\"width: 45px; height: 100%;\">\r\n  <div>\r\n  <p class=\"small p-2 ms-3 mb-1 rounded-3 p2-bg\">{user}: {message}</p>\r\n  \r\n  <p class=\"small ms-3 mb-3 rounded-3 text-muted\">23:58</p>\r\n  </div>\r\n  </div>";
            //}
            //else
            //{
                message = $"<div class=\"d-flex flex-row justify-content-end mb-4 pt-1\">\r\n  <div>\r\n  <p class=\"small p-2 me-3 mb-1  rounded-3 chat-default-bg\">{user}: {message}</p>\r\n  <p class=\"small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end\">00:06</p>\r\n  </div>\r\n <img src=\"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp\"\r\n alt=\"avatar 1\" style=\"width: 45px; height: 100%;\">\r\n </div>";
            //}

            //var sd = Context.ConnectionId;

            await Clients.Clients(conn).SendAsync("GetThatMessageDude", user, message);
        }


    }
}
