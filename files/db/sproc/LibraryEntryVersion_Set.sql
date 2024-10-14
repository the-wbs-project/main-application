DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryVersion_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryVersion_Set]
    @EntryId nvarchar(100),
    @OwnerId nvarchar(100),
    @Version int,
    @VersionAlias nvarchar(200),
    @Title nvarchar(200),
    @Description nvarchar(MAX),
    @Status nvarchar(50),
    @Categories nvarchar(MAX),
    @Disciplines nvarchar(MAX),
    @Author nvarchar(100),
    @ReleaseNotes nvarchar(MAX)
AS
BEGIN
    IF EXISTS(SELECT 1
    FROM [dbo].[LibraryEntries]
    WHERE [OwnerId] = @OwnerId AND [Id] = @EntryId)
        BEGIN
        IF EXISTS(SELECT *
        FROM [dbo].[LibraryEntryVersions]
        WHERE [EntryId] = @EntryId AND [Version] = @Version)
                BEGIN
            UPDATE [dbo].[LibraryEntryVersions]
                    SET [VersionAlias] = @VersionAlias,
                        [Title] = @Title,
                        [Description] = @Description,
                        [Status] = @Status,
                        [Categories] = @Categories,
                        [Disciplines] = @Disciplines,
                        [Author] = @Author,
                        [ReleaseNotes] = @ReleaseNotes,
                        [LastModified] = GETUTCDATE()
                    WHERE [EntryId] = @EntryId AND [Version] = @Version
        END
            ELSE
                BEGIN
            INSERT INTO [dbo].[LibraryEntryVersions]
                ([EntryId], [Version], [VersionAlias], [Title], [Description], [Status], [Categories], [Disciplines], [LastModified], [Author], [ReleaseNotes])
            VALUES
                (@EntryId, @Version, @VersionAlias, @Title, @Description, @Status, @Categories, @Disciplines, GETUTCDATE(), @Author, @ReleaseNotes)
        END
    END
END
GO