using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Logging;
using Wbs.Core.Services;
using Wbs.Core.Services.Search;
using Wbs.Functions.Configuration;

var config = new ConfigurationBuilder()
    .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .AddAzureAppConfiguration(options =>
    {
        var configBuilder = options.Connect(Environment.GetEnvironmentVariable("AppConfig:ConnectionString"))
            // Load configuration values with no label
            .Select(KeyFilter.Any, LabelFilter.Null);

        // Override with any configuration values specific to current hosting env
        foreach (var env in Environment.GetEnvironmentVariable("AppConfig:Environments").Split(","))
        {
            configBuilder = configBuilder.Select(KeyFilter.Any, env);
        }
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
        services.AddSingleton<LibraryEntryViewDataService>();
        services.AddSingleton<ListDataService>();
        services.AddSingleton<OrganizationDataService>();
        services.AddSingleton<ResourcesDataService>();
        services.AddSingleton<Storage>();
        services.AddSingleton<UserDataService>();
        services.AddSingleton<WatcherLibraryEntryDataService>();
        //
        //  Services
        //
        services.AddSingleton<CloudflareApiService>();
        services.AddSingleton<CloudflareKvService>();
        services.AddSingleton<QueueService>();
        //
        //  Search Services
        //
        services.AddSingleton<LibrarySearchIndexService>();
        services.AddSingleton<LibrarySearchService>();
    })
    .Build();

host.Run();
