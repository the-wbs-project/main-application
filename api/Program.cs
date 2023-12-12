using Auth0.ManagementApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Wbs.Api.Configuration;
using Wbs.Api.DataServices;
using Wbs.Api.Services;
using Wbs.Api.Services.Exporters;
using Wbs.Api.Services.Importers;

var builder = WebApplication.CreateBuilder(args);
//
// Add services to the container.
//
builder.Services.AddControllers();
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(builder.Configuration["AppConfig:ConnectionString"])
        // Load configuration values with no label
        .Select(KeyFilter.Any, LabelFilter.Null)
        // Override with any configuration values specific to current hosting env
        .Select(KeyFilter.Any, builder.Configuration["AppConfig:Environment"]);
});
//
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplicationInsightsTelemetry();
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
builder.Services.AddSingleton<AppConfig>();
//
//  Data Services
//
builder.Services.AddSingleton<ActivityDataService>();
builder.Services.AddSingleton<ChatDataService>();
builder.Services.AddSingleton<ChecklistDataService>();
builder.Services.AddSingleton<DocumentProcessDataService>();
builder.Services.AddSingleton<InviteDataService>();
builder.Services.AddSingleton<JiraHelpDeskDataService>();
builder.Services.AddSingleton<LibraryEntryDataService>();
builder.Services.AddSingleton<LibraryEntryNodeDataService>();
builder.Services.AddSingleton<LibraryEntryNodeResourceDataService>();
builder.Services.AddSingleton<LibraryEntryVersionResourceDataService>();
builder.Services.AddSingleton<LibraryEntryVersionDataService>();
builder.Services.AddSingleton<ListDataService>();
builder.Services.AddSingleton<OrganizationDataService>();
builder.Services.AddSingleton<ProjectApprovalDataService>();
builder.Services.AddSingleton<ProjectDataService>();
builder.Services.AddSingleton<ProjectNodeDataService>();
builder.Services.AddSingleton<ProjectNodeResourceDataService>();
builder.Services.AddSingleton<ProjectResourceDataService>();
builder.Services.AddSingleton<ProjectSnapshotDataService>();
builder.Services.AddSingleton<ResourcesDataService>();
builder.Services.AddSingleton<Storage>();
builder.Services.AddSingleton<UserDataService>();
//
//  Importers and Exporters
//
builder.Services.AddSingleton<ExcelFileExporter>();
builder.Services.AddSingleton<ExcelFileImporter>();
builder.Services.AddSingleton<ProjectFileImporter>();
//
//  Services
//
builder.Services.AddSingleton<DocumentAiService>();
builder.Services.AddSingleton<ImportLibraryEntryService>();
builder.Services.AddSingleton<JiraSyncService>();

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

