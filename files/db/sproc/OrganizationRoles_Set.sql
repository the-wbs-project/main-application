DROP PROCEDURE IF EXISTS [dbo].[OrganizationRoles_Set]
GO

CREATE PROCEDURE [dbo].[OrganizationRoles_Set]
    @OrganizationId NVARCHAR(100),
    @UserId NVARCHAR(100),
    @Roles NVARCHAR(MAX)
-- JSON string array
AS
BEGIN
    DECLARE @ExistingRoles NVARCHAR(MAX)

    -- Retrieve existing roles as a JSON array
    SELECT @ExistingRoles = (
        SELECT Role
        FROM [dbo].[OrganizationRoles]
        WHERE [OrganizationId] = @OrganizationId
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        --FOR JSON PATH, ROOT('Roles'), WITHOUT_ARRAY_WRAPPER
        )

    -- Insert history with existing and new roles
    INSERT INTO [dbo].[OrganizationRoleHistory]
    VALUES
        (
            @OrganizationId,
            @UserId,
            GETUTCDATE(),
            @ExistingRoles,
            @Roles
        )

    -- Parse the JSON array into a temporary table
    SELECT [value] AS RoleId
    INTO #RoleTable
    FROM OPENJSON(@Roles)

    -- Merge insert and delete operations
    MERGE [dbo].[OrganizationRoles] AS target
    USING #RoleTable AS source
        ON target.[OrganizationId] = @OrganizationId
        AND target.[UserId] = @UserId
        AND target.[Role] = source.RoleId
    WHEN NOT MATCHED BY TARGET THEN
        INSERT ([OrganizationId], [UserId], [Role])
        VALUES (@OrganizationId, @UserId, source.RoleId)
    WHEN NOT MATCHED BY SOURCE AND target.[OrganizationId] = @OrganizationId AND target.[UserId] = @UserId THEN
        DELETE;

    DROP TABLE #RoleTable
END
GO