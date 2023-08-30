DROP PROCEDURE IF EXISTS [dbo].[ProjectNode_Delete]
GO

CREATE PROCEDURE [dbo].[ProjectNode_Delete]
    @Id nvarchar(100),
    @ProjectId nvarchar(100),
    @OwnerId nvarchar(100)
AS
BEGIN
    IF EXISTS(SELECT 1 FROM [dbo].[Projects] WHERE [Id] = @ProjectId AND [OwnerId] = @OwnerId)
        UPDATE [dbo].[ProjectNodes]
        SET [Removed] = 1
        WHERE [Id] = @Id AND [ProjectId] = @ProjectId
END
GO
