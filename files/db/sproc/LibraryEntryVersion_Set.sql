DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryVersion_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryVersion_Set]
    @EntryId nvarchar(100),
    @OwnerId nvarchar(100),
    @Version int,
    @Status nvarchar(50),
    @Categories nvarchar(MAX),
    @Phases nvarchar(MAX),
    @Disciplines nvarchar(MAX)
AS
BEGIN
    IF EXISTS(SELECT 1 FROM [dbo].[LibraryEntries] WHERE [OwnerId] = @OwnerId AND [Id] = @EntryId)
        BEGIN
            IF EXISTS(SELECT * FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId)
                BEGIN
                    UPDATE [dbo].[LibraryEntryVersions]
                    SET [Status] = @Status,
                        [Categories] = @Categories,
                        [Phases] = @Phases,
                        [Disciplines] = @Disciplines
                    WHERE [EntryId] = @EntryId AND [Version] = @Version
                END
            ELSE
                BEGIN
                    INSERT INTO [dbo].[LibraryEntryVersions]
                    VALUES (@EntryId, @Version, @Status, @Categories, @Phases, @Disciplines)
                END
        END
END
GO