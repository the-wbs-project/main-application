using Microsoft.AspNetCore.Authentication.JwtBearer;
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
builder.Services.AddSingleton<ChecklistDataService>();
builder.Services.AddSingleton<ListDataService>();
builder.Services.AddSingleton<ProjectDataService>();
builder.Services.AddSingleton<ProjectNodeDataService>();
builder.Services.AddSingleton<ProjectSnapshotDataService>();
builder.Services.AddSingleton<ResourcesDataService>();
builder.Services.AddSingleton<Storage>();
//
//  Importers and Exporters
//
builder.Services.AddSingleton<ExcelFileExporter>();
builder.Services.AddSingleton<ExcelFileImporter>();
builder.Services.AddSingleton<ProjectFileImporter>();

builder.Services.AddSingleton<Auth0Service>();

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

