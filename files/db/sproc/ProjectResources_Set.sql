DROP PROCEDURE IF EXISTS [dbo].[ProjectResources_Set]
GO

CREATE PROCEDURE [dbo].[ProjectResources_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @ProjectId nvarchar(100),
    @Name nvarchar(100),
    @Type nvarchar(100),
    @Order int,
    @Resource nvarchar(MAX),
    @Description nvarchar(MAX),
    @Visibility nvarchar(50)
AS
DECLARE @ts DATETIMEOFFSET = GETUTCDATE();
BEGIN
    IF EXISTS(SELECT 1
    FROM [dbo].[Projects]
    WHERE [OwnerId] = @OwnerId AND [Id] = @ProjectId)
        BEGIN
        IF EXISTS(SELECT *
        FROM [dbo].[ProjectResources]
        WHERE [Id] = @Id AND [ProjectId] = @ProjectId)
                BEGIN
            UPDATE [dbo].[ProjectResources]
                    SET [Name] = @Name,
                        [Type] = @Type,
                        [Order] = @Order,
                        [LastModified] = @ts,
                        [Resource] = @Resource,
                        [Description] = @Description,
                        [Visibility] = @Visibility
                    WHERE [Id] = @Id AND [ProjectId] = @ProjectId
        END
            ELSE
                BEGIN
            INSERT INTO [dbo].[ProjectResources]
                (
                [Id],
                [ProjectId],
                [Name],
                [Type],
                [Order],
                [CreatedOn],
                [LastModified],
                [Resource],
                [Description],
                [Visibility]
                )
            VALUES
                (@Id, @ProjectId, @Name, @Type, @Order, @ts, @ts, @Resource, @Description, @Visibility)
        END
    END
END
GO