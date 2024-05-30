namespace Wbs.Core.Configuration;

public interface IDatadogConfig
{
    string ApiUrl { get; }
    string ApiKey { get; }
    string LogService { get; }
    string LogEnvironment { get; }
    string LogSource { get; }
}