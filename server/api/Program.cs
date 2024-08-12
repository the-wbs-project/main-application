using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Wbs.Api.Configuration;
using Wbs.Core.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.DataServices;
using Wbs.Core.Services;
using Wbs.Core.Services.Exporters;
using Wbs.Core.Services.Importers;
using Wbs.Core.Services.Search;

var builder = WebApplication.CreateBuilder(args);
//
// Add services to the container.
//
builder.Services.AddControllers();
builder.Configuration.AddAzureAppConfiguration(options =>
{
    var configBuilder = options.Connect(builder.Configuration["AppConfig:ConnectionString"])
        // Load configuration values with no label
        .Select(KeyFilter.Any, LabelFilter.Null);

    // Override with any configuration values specific to current hosting env
    foreach (var env in builder.Configuration["AppConfig:Environments"].Split(","))
    {
        configBuilder = configBuilder.Select(KeyFilter.Any, env);
    }
});
builder.Logging.AddProvider(new DataDogLoggerProvider(
    new DatadogConfig(builder.Configuration),
    builder.Configuration["Logging:LogLevel:Default"]));
//
//  Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = $"https://{builder.Configuration["Auth0:Domain"]}/";
    options.Audience = builder.Configuration["Auth0:Audience"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.NameIdentifier
    };
});
//
//  Configurations
//
builder.Services.AddSingleton<IAuth0Config, Auth0Config>();
builder.Services.AddSingleton<IAzureAiDocumentConfig, AzureAiDocumentConfig>();
builder.Services.AddSingleton<IAzureAiSearchConfig, AzureAiSearchConfig>();
builder.Services.AddSingleton<ICloudflareConfiguration, CloudflareConfiguration>();
builder.Services.AddSingleton<IDatabaseConfig, DatabaseConfig>();
builder.Services.AddSingleton<IJiraHelpDeskConfig, JiraHelpDeskConfig>();
builder.Services.AddSingleton<IStorageConfig, AzureStorageConfig>();
//
//  Data Services
//
builder.Services.AddSingleton<DbService>();
builder.Services.AddSingleton<ActivityDataService>();
builder.Services.AddSingleton<ChatDataService>();
builder.Services.AddSingleton<ChecklistDataService>();
builder.Services.AddSingleton<DocumentProcessDataService>();
builder.Services.AddSingleton<JiraHelpDeskDataService>();
builder.Services.AddSingleton<LibraryEntryDataService>();
builder.Services.AddSingleton<LibraryEntryNodeDataService>();
builder.Services.AddSingleton<LibraryEntryNodeResourceDataService>();
builder.Services.AddSingleton<LibraryEntryVersionResourceDataService>();
builder.Services.AddSingleton<LibraryEntryVersionDataService>();
builder.Services.AddSingleton<LibraryEntryViewDataService>();
builder.Services.AddSingleton<ListDataService>();
builder.Services.AddSingleton<OrganizationDataService>();
builder.Services.AddSingleton<ProjectApprovalDataService>();
builder.Services.AddSingleton<ProjectDataService>();
builder.Services.AddSingleton<ProjectNodeDataService>();
builder.Services.AddSingleton<ProjectNodeResourceDataService>();
builder.Services.AddSingleton<ProjectResourceDataService>();
builder.Services.AddSingleton<ProjectSnapshotDataService>();
builder.Services.AddSingleton<ResourcesDataService>();
builder.Services.AddSingleton<ResourceFileStorageService>();
builder.Services.AddSingleton<Storage>();
builder.Services.AddSingleton<UserDataService>();
builder.Services.AddSingleton<WatcherLibraryEntryDataService>();
//
//  Importers and Exporters
//
builder.Services.AddSingleton<ExcelFileExporter>();
builder.Services.AddSingleton<ExcelFileImporter>();
builder.Services.AddSingleton<ProjectFileImporter>();
//
//  Services
//
builder.Services.AddSingleton<CloudflareApiService>();
builder.Services.AddSingleton<CloudflareKvService>();
builder.Services.AddSingleton<DocumentAiService>();
builder.Services.AddSingleton<ImportLibraryEntryService>();
builder.Services.AddSingleton<QueueService>();
builder.Services.AddSingleton<ResourceCopyService>();
//
//  Search Service
//
builder.Services.AddSingleton<LibrarySearchIndexService>();
builder.Services.AddSingleton<LibrarySearchService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

