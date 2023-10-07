DROP PROCEDURE IF EXISTS [dbo].[ProjectResources_Set]
GO

CREATE PROCEDURE [dbo].[ProjectResources_Set]
    @Id nvarchar(100),
    @ProjectId nvarchar(100),
    @Name nvarchar(100),
    @Type nvarchar(100),
    @Order int,
    @Resource nvarchar(MAX),
    @Description nvarchar(MAX)
AS
    DECLARE @ts DATETIMEOFFSET = GETUTCDATE();
BEGIN
IF EXISTS(SELECT * FROM [dbo].[ProjectResources] WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[ProjectResources]
        SET [ProjectId] = @ProjectId,
            [Name] = @Name,
            [Type] = @Type,
            [Order] = @Order,
            [LastModifiedOn] = @ts,
            [Resource] = @Resource,
            [Description] = @Description
        WHERE [Id] = @Id
    END
ELSE
    BEGIN
        INSERT INTO [dbo].[ProjectResources]
        VALUES (@Id, @ProjectId, @Name, @Type, @Order, @ts, @ts, @Resource, @Description)
    END
END
GO