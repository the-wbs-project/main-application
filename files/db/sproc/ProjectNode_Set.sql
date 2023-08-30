DROP PROCEDURE IF EXISTS [dbo].[ProjectNode_Set]
GO

CREATE PROCEDURE [dbo].[ProjectNode_Set]
    @Id nvarchar(100),
    @ProjectId nvarchar(100),
    @OwnerId nvarchar(100),
    @ParentId nvarchar(100) = NULL,
    @Order int,
    @Title nvarchar(MAX),
    @Description nvarchar(MAX) = NULL,
    @DisciplineIds nvarchar(MAX) = NULL,
    @CreatedOn date,
    @LastModified date
AS
BEGIN
    IF EXISTS(SELECT 1 FROM [dbo].[Projects] WHERE [Id] = @ProjectId AND [OwnerId] = @OwnerId)
        BEGIN
            IF EXISTS(SELECT 1 FROM [dbo].[ProjectNodes] WHERE [Id] = @Id AND [ProjectId] = @ProjectId)
                BEGIN
                    UPDATE [dbo].[ProjectNodes] SET
                        [ProjectId] = @ProjectId,
                        [ParentId] = @ParentId,
                        [Order] = @Order,
                        [Title] = @Title,
                        [Description] = @Description,
                        [DisciplineIds] = @DisciplineIds,
                        [LastModified] = @LastModified
                    WHERE [Id] = @Id AND [ProjectId] = @ProjectId
                END
            ELSE
                BEGIN
                    INSERT INTO [dbo].[ProjectNodes] (
                        [Id],
                        [ProjectId],
                        [ParentId],
                        [Order],
                        [Title],
                        [Description],
                        [DisciplineIds],
                        [CreatedOn],
                        [LastModified],
                        [Removed]
                    ) VALUES (
                        @Id,
                        @ProjectId,
                        @ParentId,
                        @Order,
                        @Title,
                        @Description,
                        @DisciplineIds,
                        @CreatedOn,
                        @LastModified,
                        0
                    )
                END
        END
END
GO
