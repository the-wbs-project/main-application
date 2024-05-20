using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Azure.Functions.Worker;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Services;
using Wbs.Functions.Configuration;

var host = new HostBuilder()
        .ConfigureAppConfiguration(builder =>
        {
            builder.AddAzureAppConfiguration(options =>
            {
                options.Connect(Environment.GetEnvironmentVariable("AppConfig:ConnectionString"))
                    // Load configuration values with no label
                    .Select(KeyFilter.Any, LabelFilter.Null)
                    // Override with any configuration values specific to current hosting env
                    .Select(KeyFilter.Any, Environment.GetEnvironmentVariable("AppConfig:Environment"));
            });
        })
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
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
        //
        //  Services
        //
        services.AddSingleton<LibrarySearchIndexService>();
    })
    .Build();

host.Run();
