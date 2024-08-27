DROP PROCEDURE IF EXISTS [dbo].[LibraryEntry_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntry_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @RecordId nvarchar(100),
    @PublishedVersion int,
    @Type nvarchar(50),
    @Visibility nvarchar(50)
AS
BEGIN
    IF EXISTS(SELECT *
    FROM [dbo].[LibraryEntries]
    WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[LibraryEntries]
        SET [PublishedVersion] = @PublishedVersion,
            [Type] = @Type,
            [Visibility] = @Visibility
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[LibraryEntries]
            ([Id], [OwnerId], [RecordId], [PublishedVersion], [Type], [Visibility])
        VALUES
            (@Id, @OwnerId, @RecordId, @PublishedVersion, @Type, @Visibility)
    END
END
GO