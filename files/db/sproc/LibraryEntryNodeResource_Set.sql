DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryNodeResource_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryNodeResource_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @EntryId nvarchar(100),
    @EntryVersion int,
    @EntryNodeId nvarchar(100),
    @Name nvarchar(100),
    @Type nvarchar(100),
    @Order int,
    @Resource nvarchar(MAX),
    @Description nvarchar(MAX)
AS
    DECLARE @Error varchar(max)
    DECLARE @ts DATETIMEOFFSET = GETUTCDATE();
BEGIN
    IF NOT EXISTS(SELECT 1 FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @OwnerId AND [Id] = @EntryId)
        BEGIN
            SET @Error = 'Invalid entry (' + @OwnerId + ', ' + @EntryId + ')';

            RAISERROR(@Error, 16, 1)
        END
    ELSE IF NOT EXISTS(SELECT 1 FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion)
        BEGIN
            SET @Error  = 'Invalid version (' + @EntryId + ', ' + CAST(@EntryVersion as nvarchar(10)) + ')';

            RAISERROR(@Error, 16, 1)
        END
    ELSE IF NOT EXISTS(SELECT 1 FROM [dbo].[LibraryEntryNodes] WHERE [Id] = @EntryNodeId AND [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion)
        BEGIN
            SET @Error = 'Invalid node (' + @EntryId + ', ' + CAST(@EntryVersion as nvarchar(10)) + ', ' + @EntryNodeId + ')';

            RAISERROR(@Error, 16, 1)
        END
    ELSE IF EXISTS(SELECT * FROM [dbo].[LibraryEntryNodeResources] WHERE [Id] = @Id)
        BEGIN
            UPDATE [dbo].[LibraryEntryNodeResources]
            SET [Name] = @Name,
                [Type] = @Type,
                [Order] = @Order,
                [LastModified] = @ts,
                [Resource] = @Resource,
                [Description] = @Description
            WHERE [Id] = @Id
        END
    ELSE
        BEGIN
            INSERT INTO [dbo].[LibraryEntryNodeResources]
            VALUES (@Id, @EntryId, @EntryVersion, @EntryNodeId, @Name, @Type, @Order, @ts, @ts, @Resource, @Description)
        END
END
GO