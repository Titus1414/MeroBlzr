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
}
