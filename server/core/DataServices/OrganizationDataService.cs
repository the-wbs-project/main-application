using System.Data;
using Microsoft.Data.SqlClient;
using Wbs.Core.Models;

namespace Wbs.Core.DataServices;

public class OrganizationDataService : BaseSqlDbService
{

    public async Task<List<Organization>> GetAllAsync(SqlConnection conn)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[Organization]", conn);

        using var reader = await cmd.ExecuteReaderAsync();

        return OrganizationTransformer.ToModelList(reader);
    }

    public async Task<Organization> GetByIdAsync(SqlConnection conn, string id)
    {
        var cmd = new SqlCommand("SELECT * FROM [dbo].[Organization] WHERE [Id] = @Id", conn);

        cmd.Parameters.AddWithValue("@Id", id);

        using var reader = await cmd.ExecuteReaderAsync();

        return reader.Read() ? OrganizationTransformer.ToModel(reader) : null;
    }

    public async Task SetAsync(SqlConnection conn, Organization organization)
    {
        var cmd = new SqlCommand("dbo.Organization_Set", conn);

        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Id", organization.Id);
        cmd.Parameters.AddWithValue("@Name", organization.Name);
        cmd.Parameters.AddWithValue("@ProjectApprovalRequired", organization.ProjectApprovalRequired);
        cmd.Parameters.AddWithValue("@AiModels", DbJson(organization.AiModels));

        await cmd.ExecuteNonQueryAsync();
    }
}