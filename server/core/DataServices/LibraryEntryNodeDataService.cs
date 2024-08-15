using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class LibraryEntryNodeDataService : BaseSqlDbService
{
    public async Task<List<LibraryEntryNode>> GetListAsync(SqlConnection conn, string entryId, int entryVersion)
    {
        var results = new List<LibraryEntryNode>();

        var cmd = new SqlCommand("SELECT * FROM [dbo].[LibraryEntryNodes] WHERE [Removed] = 0 AND [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
                results.Add(ToModel(reader));
        }
        return results;
    }

    public async Task<bool> VerifyAsync(SqlConnection conn, string owner, string entryId, int entryVersion, string nodeId)
    {
        var cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[LibraryEntryNodes] WHERE [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion AND [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@Id", nodeId);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (reader.Read()) return reader.GetInt32(0) == 1;
        }
        return false;
    }

    public async Task SetAsync(SqlConnection conn, string entryId, int entryVersion, IEnumerable<LibraryEntryNode> nodes, IEnumerable<string> removeIds)
    {
        var dbNodes = nodes.Select(n => new
        {
            Id = n.id,
            ParentId = n.parentId,
            Title = n.title,
            Description = n.description,
            PhaseIdAssociation = n.phaseIdAssociation,
            Order = n.order,
            DisciplineIds = n.disciplineIds,
            Visibility = n.visibility,
            LibraryLink = n.libraryLink == null ? null : JsonSerializer.Serialize(n.libraryLink),
            LibraryTaskLink = n.libraryTaskLink == null ? null : JsonSerializer.Serialize(n.libraryTaskLink)
        }).ToArray();

        var cmd = new SqlCommand("dbo.LibraryEntryNode_Set", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@EntryId", entryId);
        cmd.Parameters.AddWithValue("@EntryVersion", entryVersion);
        cmd.Parameters.AddWithValue("@Upserts", JsonSerializer.Serialize(dbNodes));
        cmd.Parameters.AddWithValue("@RemoveIds", JsonSerializer.Serialize(removeIds));

        await cmd.ExecuteNonQueryAsync();
    }

    private LibraryEntryNode ToModel(SqlDataReader reader)
    {
        return new LibraryEntryNode
        {
            id = DbValue<string>(reader, "Id"),
            parentId = DbValue<string>(reader, "ParentId"),
            createdOn = DbValue<DateTimeOffset>(reader, "CreatedOn"),
            lastModified = DbValue<DateTimeOffset>(reader, "LastModified"),
            title = DbValue<string>(reader, "Title"),
            description = DbValue<string>(reader, "Description"),
            phaseIdAssociation = DbValue<string>(reader, "PhaseIdAssociation"),
            order = DbValue<int>(reader, "Order"),
            disciplineIds = DbJson<string[]>(reader, "DisciplineIds"),
            libraryLink = DbJson<LibraryLink>(reader, "LibraryLink"),
            libraryTaskLink = DbJson<LibraryTaskLink>(reader, "LibraryTaskLink"),
            visibility = DbValue<string>(reader, "Visibility")
        };
    }
}
