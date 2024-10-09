ALTER TABLE [dbo].[LibraryEntryVersions] DROP COLUMN [Editors]
GO
ALTER TABLE [dbo].[Projects] DROP COLUMN [Roles]
GO
DROP PROCEDURE IF EXISTS [dbo].[Project_Set]
GO

CREATE PROCEDURE [dbo].[Project_Set]
    @Id nvarchar(100),
    @RecordId nvarchar(100),
    @OwnerId nvarchar(100),
    @CreatedBy nvarchar(100),
    @Title nvarchar(200),
    @Description nvarchar(MAX),
    @Status nvarchar(50),
    @MainNodeView nvarchar(20),
    @Category nvarchar(50),
    @Disciplines nvarchar(MAX),
    @ApprovalStarted bit = NULL,
    @LibraryLink nvarchar(MAX)
AS
BEGIN
    IF EXISTS(SELECT *
    FROM [dbo].[Projects]
    WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[Projects]
        SET [OwnerId] = @OwnerId,
            [CreatedBy] = @CreatedBy,
            [Title] = @Title,
            [Description] = @Description,
            [LastModified] = GETUTCDATE(),
            [Status] = @Status,
            [MainNodeView] = @MainNodeView,
            [Category] = @Category,
            [Disciplines] = @Disciplines,
            [ApprovalStarted] = @ApprovalStarted,
            [LibraryLink] = @LibraryLink
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[Projects]
        VALUES
            (@Id, @RecordId, @OwnerId, @CreatedBy, GETUTCDATE(), @Title, @Description, GETUTCDATE(), @Status, @MainNodeView, @Category, @Disciplines, @ApprovalStarted, @LibraryLink)
    END
END
GO

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
            VALUES
                (@EntryId, @Version, @VersionAlias, @Title, @Description, @Status, @Categories, @Disciplines, GETUTCDATE(), @Author, @ReleaseNotes)
        END
    END
END
GO
