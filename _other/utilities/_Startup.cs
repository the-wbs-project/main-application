using Wbs.Utilities.Configuration;
using Wbs.Utilities.DataServices;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using Wbs.Utilities.Services.Importers;
using Wbs.Utilities.Services.Exporters;

[assembly: FunctionsStartup(typeof(Wbs.Utilities.Startup))]
namespace Wbs.Utilities
{
    public class Startup : FunctionsStartup
    {
        private static IConfiguration Configuration { set; get; }

        private static AppConfig config { get; set; }

        private static CosmosClient cosmos { get; set; }

        public override void Configure(IFunctionsHostBuilder builder)
        {
            var cs = Environment.GetEnvironmentVariable("ConnectionStrings_Configurations");
            var environments = Environment.GetEnvironmentVariable("Configurations_Environment").Split(',');
            var configBuilder = new ConfigurationBuilder();

            configBuilder.AddAzureAppConfiguration(options =>
            {
                var o = options.Connect(cs).Select(KeyFilter.Any, LabelFilter.Null);

                foreach (var l in environments)
                    o = o.Select(KeyFilter.Any, l);
            });
            Configuration = configBuilder.Build();
            config = new AppConfig(Configuration);
            cosmos = new CosmosClient(config.cosmos.connectionString);

            //ConfigureTelemetry(builder);

            builder.Services.AddLogging();
            //builder.Services.AddHttpClient();
            builder.Services.AddSingleton(config);
            builder.Services.AddSingleton(cosmos);

            SetupDataServices(builder);
            SetupServices(builder);
        }

        private void SetupDataServices(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<MetadataDataService, MetadataDataService>();
            builder.Services.AddSingleton<Storage, Storage>();
        }

        private void SetupServices(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<ExcelFileImporter, ExcelFileImporter>();
            builder.Services.AddSingleton<ProjectFileImporter, ProjectFileImporter>();
            builder.Services.AddSingleton<ExcelFileExporter, ExcelFileExporter>();

            
        }

        private void ConfigureTelemetry(IFunctionsHostBuilder builder)
        {
            var configDescriptor = builder.Services.SingleOrDefault(tc => tc.ServiceType == typeof(TelemetryConfiguration));
            if (configDescriptor?.ImplementationFactory == null)
                return;

            var implFactory = configDescriptor.ImplementationFactory;

            builder.Services.Remove(configDescriptor);
            builder.Services.AddSingleton(provider =>
            {
                if (!(implFactory.Invoke(provider) is TelemetryConfiguration config))
                    return null;

                config.TelemetryProcessorChainBuilder.Use(next => new SuccessfulDependencyFilter(next, Configuration));
                config.TelemetryProcessorChainBuilder.Build();

                return config;
            });
        }
    }
}
