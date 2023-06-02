namespace MerolekiandoBlazor.Data
{
    public class UserDto
    {
        public string nameid { get; set; }

        public string unique_name { get; set; }
        public string Name { get; set; }
        public string ID { get; set; }
        public int nbf { get; set; }
        public int exp { get; set; }
        public int iat { get; set; }
    }
    public class SellerDto
    {
        public string text { get; set; }

        public string connId { get; set; }
        public int from { get; set; }
        public long when { get; set; }
        public int to { get; set; }
        public string type { get; set; }
        public string Link { get; set; }
    }
    public class chatUsersDto
    {
        public int id { get; set; }
        public int from { get; set; }
        public int? to { get; set; }
        public string connId { get; set; }
        public string lastMessage { get; set; }
        public string name { get; set; }
        public bool? read { get; set; }
        public List<int> productIds { get; set; }
        public string fromImage { get; set; }
        public string productImage { get; set; }
        public long lastMessgeTime { get; set; }
    }


}

public class PreviousChatDto
{
    public Result[] result { get; set; }
}

public class Result
{
    public int id { get; set; }
    public int senderId { get; set; }
    public int recieverId { get; set; }
    public string message { get; set; }
    public string connId { get; set; }
    public string connFrom { get; set; }
    public string connTo { get; set; }
    public string type { get; set; }
    public object link { get; set; }
    public object status { get; set; }
    public long time { get; set; }
    public object key { get; set; }
    public int? productId { get; set; }
}
