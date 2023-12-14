DROP PROCEDURE IF EXISTS [dbo].[LibraryEntry_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntry_Set]
    @Id nvarchar(100),
    @PublishedVersion int,
    @OwnerId nvarchar(100),
    @Type nvarchar(50),
    @Author nvarchar(100),
    @Title nvarchar(200),
    @Description nvarchar(MAX),
    @Visibility nvarchar(50)
AS
BEGIN
IF EXISTS(SELECT * FROM [dbo].[LibraryEntries] WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[LibraryEntries]
        SET [PublishedVersion] = @PublishedVersion,
            [Type] = @Type,
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
        VALUES (@Id, @OwnerId, @PublishedVersion, @Type, @Author, @Title, @Description, GETUTCDATE(), @Visibility)
    END
END
GO