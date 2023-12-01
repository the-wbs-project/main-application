DROP PROCEDURE IF EXISTS [dbo].[ProjectNodeResources_Set]
GO

CREATE PROCEDURE [dbo].[ProjectNodeResources_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @ProjectId nvarchar(100),
    @ProjectNodeId nvarchar(100),
    @Name nvarchar(100),
    @Type nvarchar(100),
    @Order int,
    @Resource nvarchar(MAX),
    @Description nvarchar(MAX)
AS
    DECLARE @ts DATETIMEOFFSET = GETUTCDATE();
BEGIN
    IF EXISTS(SELECT 1 FROM [dbo].[Projects] WHERE [OwnerId] = @OwnerId AND [Id] = @ProjectId) AND
       EXISTS(SELECT 1 FROM [dbo].[ProjectNodes] WHERE [ProjectId] = @ProjectId AND [Id] = @ProjectNodeId)
        BEGIN
            IF EXISTS(SELECT * FROM [dbo].[ProjectNodeResources] WHERE [Id] = @ProjectNodeId AND [ProjectId] = @ProjectId)
                BEGIN
                    UPDATE [dbo].[ProjectNodeResources]
                    SET [Name] = @Name,
                        [Type] = @Type,
                        [Order] = @Order,
                        [LastModified] = @ts,
                        [Resource] = @Resource,
                        [Description] = @Description
                    WHERE [Id] = @Id AND [ProjectId] = @ProjectId AND [NodeId] = @ProjectNodeId
                END
            ELSE
                BEGIN
                    INSERT INTO [dbo].[ProjectNodeResources]
                    VALUES (@Id, @ProjectId, @ProjectNodeId, @Name, @Type, @Order, @ts, @ts, @Resource, @Description)
                END
        END
END
GO