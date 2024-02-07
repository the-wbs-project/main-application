DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryNode_Delete]
GO

CREATE PROCEDURE [dbo].[LibraryEntryNode_Delete]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @EntryId nvarchar(100),
    @EntryVersion int
AS
BEGIN
-- TO DO FINISH THIS STORED PROCEDURE
    IF EXISTS(SELECT 1 FROM [dbo].[LibraryEntries] WHERE [Id] = @EntryId AND [OwnerId] = @OwnerId) AND 
       EXISTS(SELECT 1 FROM [dbo].[LibraryEntryVersions] WHERE [EntryId] = @EntryId AND [Version] = @EntryVersion)
    BEGIN
        UPDATE [dbo].[LibraryEntryNodes]
        SET [Removed] = 1
        WHERE [Id] = @Id AND [EntryId] = @EntryId AND [EntryVersion] = @EntryVersion
    END
END
GO
