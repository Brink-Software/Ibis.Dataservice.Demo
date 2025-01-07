namespace TestErpApp;

public class KeyStore
{
    public KeyStore(ILogger<KeyStore> logger)
    {
        Key = "TestKey";
        Logger = logger;
    }
    private string _key = string.Empty;

    public string Key
    {
        get => _key;
        set
        {
            _key = value;
        }
    }

    public ILogger<KeyStore> Logger { get; }
}
