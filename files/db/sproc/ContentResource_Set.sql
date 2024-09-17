DROP PROCEDURE IF EXISTS [dbo].[ContentResource_Set]
GO

CREATE PROCEDURE [dbo].[ContentResource_Set]
    @Id nvarchar(100),
    @OwnerId nvarchar(100),
    @ParentId nvarchar(100),
    @Name nvarchar(100),
    @Type nvarchar(100),
    @Order int,
    @Resource nvarchar(MAX),
    @Description nvarchar(MAX),
    @Visibility nvarchar(50)
AS
DECLARE @Error varchar(max)
DECLARE @ts DATETIMEOFFSET = GETUTCDATE();
BEGIN
    IF EXISTS(SELECT *
    FROM [dbo].[ContentResources]
    WHERE [Id] = @Id)
        BEGIN
        UPDATE [dbo].[ContentResources]
            SET [Name] = @Name,
                [Type] = @Type,
                [Order] = @Order,
                [LastModified] = @ts,
                [Resource] = @Resource,
                [Description] = @Description,
                [Visibility] = @Visibility
            WHERE [Id] = @Id AND [OwnerId] = @OwnerId
    -- Adding owner here helps prevent permission conflicts
    END
    ELSE
        BEGIN
        INSERT INTO [dbo].[ContentResources]
        VALUES
            (@Id, @OwnerId, @ParentId, @Name, @Type, @Order, @ts, @ts, @Resource, @Description, @Visibility)
    END
END
GO