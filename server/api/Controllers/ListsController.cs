﻿using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListsController : ControllerBase
{
    private readonly ILogger<ListsController> logger;
    private readonly ListDataService dataService;

    public ListsController(ILoggerFactory loggerFactory, ListDataService dataService)
    {
        logger = loggerFactory.CreateLogger<ListsController>();
        this.dataService = dataService;
    }

    [HttpGet("{type}")]
    public async Task<IActionResult> GetAll(string type)
    {
        try
        {
            return Ok(await dataService.GetAsync(type));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving lists");
            return new StatusCodeResult(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(ListItem resource)
    {
        try
        {
            await dataService.SetAsync(resource);

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving lists");
            return new StatusCodeResult(500);
        }
    }

    [HttpDelete("{type}/{id}")]
    public async Task<IActionResult> Delete(string type, string id)
    {
        try
        {
            await dataService.DeleteAsync(type, id);

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting lists");
            return new StatusCodeResult(500);
        }
    }
}

