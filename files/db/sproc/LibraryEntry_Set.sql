DROP PROCEDURE IF EXISTS [dbo].[LibraryEntry_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntry_Set]
    @Id nvarchar(100),
    @PublishedVersion int,
    @OwnerId nvarchar(100),
    @Author nvarchar(100),
    @Title nvarchar(200),
    @Description nvarchar(MAX),
    @Visibility int
AS
BEGIN
IF EXISTS(SELECT * FROM [dbo].[LibraryEntries] WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[LibraryEntries]
        SET [PublishedVersion] = @PublishedVersion,
            [OwnerId] = @OwnerId,
            [Author] = @Author,
            [LastModified] = GETUTCDATE(),
            [Title] = @Title,
            [Description] = @Description,
            [Visibility] = @Visibility
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[LibraryEntries]
        VALUES (@Id, @OwnerId, @PublishedVersion, @Author, @Title, @Description, GETUTCDATE(), @Visibility)
    END
END
GO