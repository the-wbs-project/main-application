DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryVersionEditors_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryVersionEditors_Set]
    @EntryId NVARCHAR(100),
    @Version INT,
    @Editors NVARCHAR(MAX)
-- JSON string array
AS
BEGIN
    -- Parse the JSON array into a temporary table
    SELECT [value] AS EditorId
    INTO #EditorsTable
    FROM OPENJSON(@Editors)

    -- Merge insert and delete operations
    MERGE [dbo].[LibraryEntryVersionEditors] AS target
    USING #EditorsTable AS source
        ON target.[EntryId] = @EntryId
        AND target.[Version] = @Version
        AND target.[EditorId] = source.EditorId
    WHEN NOT MATCHED BY TARGET THEN
        INSERT ([EntryId], [Version], [EditorId])
        VALUES (@EntryId, @Version, source.EditorId)
    WHEN NOT MATCHED BY SOURCE AND target.[EntryId] = @EntryId AND target.[Version] = @Version THEN
        DELETE;

    DROP TABLE #EditorsTable
END
GO

DROP PROCEDURE IF EXISTS [dbo].[Organization_Set]
GO

CREATE PROCEDURE [dbo].[Organization_Set]
    @Id NVARCHAR(100),
    @Name NVARCHAR(100),
    @AiModels NVARCHAR(MAX)
AS
BEGIN
    IF EXISTS(SELECT *
    FROM [dbo].[Organization]
    WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[Organization]
        SET [Name] = @Name,
            [AiModels] = @AiModels,
            [UpdatedAt] = GETUTCDATE()
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[Organization]
            (
            [Id],
            [Name],
            [AiModels],
            [CreatedAt],
            [UpdatedAt]
            )
        VALUES
            (@Id, @Name, @AiModels, GETUTCDATE(), GETUTCDATE())
    END
END
GO

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