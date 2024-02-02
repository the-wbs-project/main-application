DROP PROCEDURE IF EXISTS [dbo].[LibraryEntry_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntry_Set]
    @Id nvarchar(100),
    @PublishedVersion int,
    @OwnerId nvarchar(100),
    @Type nvarchar(50),
    @Author nvarchar(100),
    @Visibility nvarchar(50),
    @Editors nvarchar(MAX)
AS
BEGIN
IF EXISTS(SELECT * FROM [dbo].[LibraryEntries] WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[LibraryEntries]
        SET [PublishedVersion] = @PublishedVersion,
            [Type] = @Type,
            [Author] = @Author,
            [Visibility] = @Visibility,
            [Editors] = @Editors
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[LibraryEntries]
        VALUES (@Id, @OwnerId, @PublishedVersion, @Type, @Author, @Visibility, @Editors)
    END
END
GO