using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Logging;
using Wbs.Core.Services;
using Wbs.Functions.Configuration;

var config = new ConfigurationBuilder()
    .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .AddAzureAppConfiguration(options =>
    {
        options.Connect(Environment.GetEnvironmentVariable("AppConfig:ConnectionString"))
            // Load configuration values with no label
            .Select(KeyFilter.Any, LabelFilter.Null)
            // Override with any configuration values specific to current hosting env
            .Select(KeyFilter.Any, Environment.GetEnvironmentVariable("AppConfig:Environment"));
    })
    .Build();

var host = new HostBuilder()
    .ConfigureAppConfiguration(builder =>
    {
        builder.Sources.Clear();
        builder.AddConfiguration(config);
    })
    .ConfigureLogging(builder =>
    {
        builder.AddProvider(new DataDogLoggerProvider(
            new DatadogConfig(config),
            config["Logging:LogLevel:Default"]));
    })
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        //services.AddApplicationInsightsTelemetryWorkerService();
        //services.ConfigureFunctionsApplicationInsights();
        //
        //  Config
        //
        services.AddSingleton<IAuth0Config, Auth0Config>();
        services.AddSingleton<IAzureAiSearchConfig, AzureAiSearchConfig>();
        services.AddSingleton<IDatabaseConfig, DatabaseConfig>();
        services.AddSingleton<IStorageConfig, AzureStorageConfig>();
        //
        //  Data Services
        //
        services.AddSingleton<DbService>();
        services.AddSingleton<LibraryEntryDataService>();
        services.AddSingleton<LibraryEntryNodeDataService>();
        services.AddSingleton<LibraryEntryVersionDataService>();
        services.AddSingleton<ListDataService>();
        services.AddSingleton<OrganizationDataService>();
        services.AddSingleton<ResourcesDataService>();
        services.AddSingleton<UserDataService>();
        services.AddSingleton<WatcherLibraryEntryDataService>();
        //
        //  Services
        //
        services.AddSingleton<LibrarySearchIndexService>();
    })
    .Build();

host.Run();
