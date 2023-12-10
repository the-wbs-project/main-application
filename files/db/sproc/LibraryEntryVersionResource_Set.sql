DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryVersionResource_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryVersionResource_Set]
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
       EXISTS(SELECT 1 FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion)
        BEGIN
            IF EXISTS(SELECT * FROM [dbo].[LibraryEntryVersionResource_Set] WHERE [Id] = @Id)
                BEGIN
                    UPDATE [dbo].[LibraryEntryVersionResource_Set]
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
                    INSERT INTO [dbo].[LibraryEntryVersionResource_Set]
                    VALUES (@Id, @EntryId, @EntryVersion, @Name, @Type, @Order, @ts, @ts, @Resource, @Description)
                END
        END
END
GO