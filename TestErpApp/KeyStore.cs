namespace TestErpApp
{
    public class KeyStore
    {
        private string _key = string.Empty;
        
        public string Key
        {
            get => _key;
            set 
            {
                _key = value;
            } 
        }
    }
}
