DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryResources_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryResources_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @EntryId nvarchar(100),
    @EntryVersion int,
    @Name nvarchar(100),
    @Type nvarchar(100),
    @Order int,
    @Resource nvarchar(MAX),
    @Description nvarchar(MAX)
AS
    DECLARE @ts DATETIMEOFFSET = GETUTCDATE();
BEGIN
    IF EXISTS(SELECT 1 FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @OwnerId AND [Id] = @EntryId) AND
       EXISTS(SELECT 1 FROM [dbo].[LibraryEntryVersions] WHERE [Id] = @EntryId AND [Version] = @EntryVersion)
        BEGIN
            IF EXISTS(SELECT * FROM [dbo].[LibraryEntryResources] WHERE [Id] = @Id)
                BEGIN
                    UPDATE [dbo].[LibraryEntryResources]
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
                    INSERT INTO [dbo].[LibraryEntryResources]
                    VALUES (@Id, @EntryId, @EntryVersion, @Name, @Type, @Order, @ts, @ts, @Resource, @Description)
                END
        END
END
GO