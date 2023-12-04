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
    IF EXISTS(SELECT 1 FROM [dbo].[Projects] WHERE [Id] = @ProjectId AND [OwnerId] = @OwnerId)
        UPDATE [dbo].[ProjectNodes]
        SET [Removed] = 1
        WHERE [Id] = @Id AND [ProjectId] = @ProjectId
END
GO
