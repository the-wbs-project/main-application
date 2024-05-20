namespace Wbs.Core.Configuration;

public interface IAuth0Config
{
    string Domain { get; }
    string Audience { get; }
    string ClientId { get; }
    string Connection { get; }
    string M2MClientId { get; }
    string M2MClientSecret { get; }
}