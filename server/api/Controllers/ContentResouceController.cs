
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Models;

[ApiController]
[Route("api/portfolio/{owner}/content-resources")]
public class ContentResourcesController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DbService db;
    private readonly ContentResourceDataService dataService;
    private readonly ContentResourceStorageService storageService;

    public ContentResourcesController(ILoggerFactory loggerFactory, DbService db, ContentResourceDataService dataService, ContentResourceStorageService storageService)
    {
        logger = loggerFactory.CreateLogger<ContentResourcesController>();
        this.db = db;
        this.dataService = dataService;
        this.storageService = storageService;
    }

    [Authorize]
    [HttpGet("{parentId}")]
    public async Task<IActionResult> GetResources(string owner, string parentId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                return Ok(await dataService.GetListAsync(conn, owner, parentId));
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting content resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{parentId}/resource/{resourceId}")]
    public async Task<IActionResult> GetResource(string owner, string parentId, string resourceId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                var record = await dataService.GetAsync(conn, owner, resourceId);

                if (record == null) return NotFound();
                if (record.ParentId != parentId) return BadRequest();

                return Ok(record);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting content resource");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{parentId}/resource/{resourceId}")]
    public async Task<IActionResult> PutResource(string owner, string parentId, string resourceId, ContentResource record)
    {
        try
        {
            if (record.Id != resourceId) return BadRequest("The Id is invalid");
            if (record.ParentId != parentId) return BadRequest("The Parent Id is invalid");
            if (record.OwnerId != owner) return BadRequest("The Owner Id is invalid");

            using (var conn = await db.CreateConnectionAsync())
            {
                await dataService.SetAsync(conn, record);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving project node resources");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpDelete("{parentId}/resource/{resourceId}")]
    public async Task<IActionResult> DeleteResource(string owner, string parentId, string resourceId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                var record = await dataService.GetAsync(conn, owner, resourceId);

                if (record == null) return NotFound();
                if (record.ParentId != parentId) return BadRequest();

                await dataService.DeleteAsync(conn, owner, resourceId);
                await storageService.DeleteAsync(owner, resourceId);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting resource {resourceId} for parent {parentId}", resourceId, parentId);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("{parentId}/resource/{resourceId}/file")]
    public async Task<IActionResult> GetResourceFile(string owner, string parentId, string resourceId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                await storageService.Copy();
                var record = await dataService.GetAsync(conn, owner, resourceId);

                if (record == null) return NotFound();
                if (record.ParentId != parentId) return BadRequest();
                if (record.OwnerId != owner) return BadRequest();

                var file = await storageService.GetResourceAsync(owner, resourceId);

                return File(file, "application/octet-stream", record.Resource);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting content resource");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{parentId}/resource/{resourceId}/file")]
    public async Task<IActionResult> PutResourceFile(string owner, string parentId, string resourceId)
    {
        try
        {
            using (var conn = await db.CreateConnectionAsync())
            {
                var record = await dataService.GetAsync(conn, owner, resourceId);

                if (record == null) return NotFound();
                if (record.ParentId != parentId) return BadRequest();
                if (record.OwnerId != owner) return BadRequest();

                Request.EnableBuffering();
                Request.Body.Position = 0;
                var bytes = new byte[] { };

                using (var stream = new MemoryStream())
                {
                    await Request.Body.CopyToAsync(stream);

                    bytes = stream.ToArray();
                }

                await storageService.SaveAsync(owner, resourceId, bytes);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving content resource file");
            return new StatusCodeResult(500);
        }
    }
}
