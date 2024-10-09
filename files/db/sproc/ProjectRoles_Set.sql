DROP PROCEDURE IF EXISTS [dbo].[ProjectRoles_Set]
GO

CREATE PROCEDURE [dbo].[ProjectRoles_Set]
    @ProjectId NVARCHAR(100),
    @UserRoles NVARCHAR(MAX)
AS
BEGIN
    -- Parse the JSON array into a temporary table
    SELECT
        JSONData.userId,
        JSONData.roleId
    INTO #UserRoles
    FROM OPENJSON(@UserRoles)
    WITH (
        userId NVARCHAR(100) '$.userId',
        roleId NVARCHAR(100) '$.roleId'
    ) AS JSONData

    -- Merge insert and delete operations
    MERGE [dbo].[ProjectRoles] AS target
    USING #UserRoles AS source
        ON target.[ProjectId] = @ProjectId
        AND target.[UserId] = source.userId
        AND target.[Role] = source.roleId
    WHEN NOT MATCHED BY TARGET THEN
        INSERT ([ProjectId], [UserId], [Role])
        VALUES (@ProjectId, source.userId, source.roleId)
    WHEN NOT MATCHED BY SOURCE AND target.[ProjectId] = @ProjectId THEN
        DELETE;

    DROP TABLE #UserRoles
END
GO