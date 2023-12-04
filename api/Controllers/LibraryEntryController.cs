using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Api.DataServices;
using Wbs.Api.Models;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/library")]
public class LibraryEntryController : ControllerBase
{
    private readonly TelemetryClient telemetry;
    private readonly ILogger<ProjectsController> logger;
    private readonly LibraryEntryDataService entryDataService;
    private readonly LibraryEntryVersionDataService versionDataService;
    private readonly LibraryEntryNodeDataService nodeDataService;
    private readonly LibraryEntryResourceDataService resourceDataService;
    private readonly LibraryEntryNodeResourceDataService nodeResourceDataService;

    public LibraryEntryController(ILogger<ProjectsController> logger, TelemetryClient telemetry, LibraryEntryDataService entryDataService, LibraryEntryNodeDataService nodeDataService, LibraryEntryVersionDataService versionDataService, LibraryEntryResourceDataService resourceDataService, LibraryEntryNodeResourceDataService nodeResourceDataService)
    {
        this.logger = logger;
        this.telemetry = telemetry;
        this.entryDataService = entryDataService;
        this.versionDataService = versionDataService;
        this.nodeDataService = nodeDataService;
        this.resourceDataService = resourceDataService;
        this.nodeResourceDataService = nodeResourceDataService;
    }

    [Authorize]
    [HttpGet("owner/{owner}/entries")]
    public async Task<IActionResult> GetByOwnerAsync(string owner)
    {
        try
        {
            return Ok(await entryDataService.GetByOwnerAsync(owner));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/entries/{entryId}")]
    public async Task<IActionResult> GetByIdAsync(string owner, string entryId)
    {
        try
        {
            return Ok(await entryDataService.GetByIdAsync(owner, entryId));
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/entries/{entryId}")]
    public async Task<IActionResult> Put(string owner, string entryId, LibraryEntry entry)
    {
        try
        {
            if (entry.owner != owner) return BadRequest("Owner in url must match owner in body");
            if (entry.id != entryId) return BadRequest("Id in url must match owner in body");

            await entryDataService.SetAsync(entry);

            return Accepted();
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/entries/{entryId}/versions")]
    public async Task<IActionResult> GetVersionsAsync(string owner, string entryId)
    {
        try
        {
            using (var conn = entryDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");

                return Ok(await versionDataService.GetListAsync(conn, entryId));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/entries/{entryId}/versions/{entryVersion}")]
    public async Task<IActionResult> GetVersionByIdAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = entryDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");

                return Ok(await versionDataService.GetByIdAsync(conn, entryId, entryVersion));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/entries/{entryId}/versions/{entryVersion}")]
    public async Task<IActionResult> PutVersionAsync(string owner, string entryId, int entryVersion, LibraryEntryVersion model)
    {
        try
        {
            if (model.entryId != entryId) return BadRequest("EntryId in body must match EntryId in url");
            if (model.version != entryVersion) return BadRequest("Version in body must match Version in url");

            using (var conn = entryDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await entryDataService.VerifyAsync(conn, owner, entryId))
                    return BadRequest("Library Entry not found for the credentials provided.");

                await versionDataService.SetAsync(conn, owner, model);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/entries/{entryId}/versions/{entryVersion}/nodes")]
    public async Task<IActionResult> GetNodesAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = entryDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Library Entry Version not found for the credentials provided.");

                return Ok(await nodeDataService.GetListAsync(conn, entryId, entryVersion));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/entries/{entryId}/version/{entryVersion}/nodes")]
    public async Task<IActionResult> PutNode(string owner, string entryId, int entryVersion, BulkSaveRecord<LibraryEntryNode> record)
    {
        try
        {
            if (record.upserts == null) record.upserts = new LibraryEntryNode[] { };
            if (record.removeIds == null) record.removeIds = new string[] { };
            //
            //  Verify records credentails matches the URL
            //
            foreach (var upsert in record.upserts)
            {
                if (upsert.entryId != entryId)
                    return BadRequest("All records must have same entry ID as provided in url");

                if (upsert.entryVersion != entryVersion)
                    return BadRequest("All records must have same entry version as provided in url");
            }

            using (var conn = nodeDataService.CreateConnection())
            {
                await conn.OpenAsync();
                //
                //  Make the version actually exists
                //
                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Library Entry Version not found for the credentials provided.");

                await nodeDataService.SetSaveRecordAsync(conn, owner, entryId, entryVersion, record);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/entries/{entryId}/versions/{entryVersion}/resources")]
    public async Task<IActionResult> GetResourcesAsync(string owner, string entryId, int entryVersion)
    {
        try
        {
            using (var conn = resourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Entry Version not found for the owner provided.");

                return Ok(await resourceDataService.GetListAsync(conn, entryId, entryVersion));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/entries/{entryId}/versions/{entryVersion}/resources/{resourceId}")]
    public async Task<IActionResult> PutResourceAsync(string owner, string entryId, int entryVersion, string resourceId, ResourceRecord model)
    {
        try
        {
            if (model.Id != resourceId) return BadRequest("Id in body must match ResourceId in url");

            using (var conn = resourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await versionDataService.VerifyAsync(conn, owner, entryId, entryVersion))
                    return BadRequest("Entry Version not found for the owner provided.");

                await resourceDataService.SetAsync(conn, owner, entryId, entryVersion, model);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpGet("owner/{owner}/entries/{entryId}/versions/{entryVersion}/nodes/{nodeId}/resources")]
    public async Task<IActionResult> GetNodeResourcesAsync(string owner, string entryId, int entryVersion, string nodeId)
    {
        try
        {
            using (var conn = resourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await nodeDataService.VerifyAsync(conn, owner, entryId, entryVersion, nodeId))
                    return BadRequest("Entry Node not found for the credentails provided.");

                return Ok(await nodeResourceDataService.GetListAsync(conn, entryId, entryVersion, nodeId));
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("owner/{owner}/entries/{entryId}/versions/{entryVersion}/nodes/{nodeId}/resources/{resourceId}")]
    public async Task<IActionResult> PutNodeResourceAsync(string owner, string entryId, int entryVersion, string nodeId, string resourceId, ResourceRecord model)
    {
        try
        {
            if (model.Id != resourceId) return BadRequest("Id in body must match ResourceId in url");

            using (var conn = resourceDataService.CreateConnection())
            {
                await conn.OpenAsync();

                if (!await nodeDataService.VerifyAsync(conn, owner, entryId, entryVersion, nodeId))
                    return BadRequest("Entry Node not found for the credentails provided.");

                await nodeResourceDataService.SetAsync(conn, owner, entryId, entryVersion, nodeId, model);

                return NoContent();
            }
        }
        catch (Exception ex)
        {
            telemetry.TrackException(ex);
            return new StatusCodeResult(500);
        }
    }
}

