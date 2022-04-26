namespace Wbs.Utilities.Models
{
    public interface IIdObject
    {
        string id { get; set; }
    }
    public interface IDbObject : IIdObject
    {
        string pk { get; }
    }
}
