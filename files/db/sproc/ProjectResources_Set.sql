DROP PROCEDURE IF EXISTS [dbo].[RecordResources_Set]
GO

CREATE PROCEDURE [dbo].[RecordResources_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @RecordId nvarchar(100),
    @Name nvarchar(100),
    @Type nvarchar(100),
    @Order int,
    @Resource nvarchar(MAX),
    @Description nvarchar(MAX)
AS
    DECLARE @ts DATETIMEOFFSET = GETUTCDATE();
BEGIN
IF EXISTS(SELECT * FROM [dbo].[RecordResources] WHERE [Id] = @Id)
    BEGIN
        UPDATE [dbo].[RecordResources]
        SET [OwnerId] = @OwnerId,
            [RecordId] = @RecordId,
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
        INSERT INTO [dbo].[RecordResources]
        VALUES (@Id, @OwnerId, @RecordId, @Name, @Type, @Order, @ts, @ts, @Resource, @Description)
    END
END
GO