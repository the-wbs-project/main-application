CREATE TABLE [dbo].[ContentResources]
(
    [Id] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [ParentId] nvarchar(100) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [CreatedOn] DateTimeOffset NOT NULL,
    [LastModified] DateTimeOffset NOT NULL,
    [Resource] nvarchar(MAX) NULL,
    [Description] nvarchar(MAX) NULL,
    [Visibility] nvarchar(50) NULL,
    CONSTRAINT [ContentResources_PK] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

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
--
--  Populate the new table
--
INSERT INTO [dbo].[ContentResources]
SELECT [Id], [OwnerId], [EntryId] + '-' + CAST([EntryVersion] AS nvarchar(10)), [Name], [Type], [Order], [CreatedOn], [LastModified], [Resource], [Description], [Visibility]
FROM [dbo].[LibraryEntryVersionResources]

INSERT INTO [dbo].[ContentResources]
SELECT [Id], [OwnerId], [EntryNodeId], [Name], [Type], [Order], [CreatedOn], [LastModified], [Resource], [Description], [Visibility]
FROM [dbo].[LibraryEntryNodeResources]

INSERT INTO [dbo].[ContentResources]
SELECT [Id], [OwnerId], [ProjectId], [Name], [Type], [Order], [CreatedOn], [LastModified], [Resource], [Description], [Visibility]
FROM [dbo].[ProjectResources]

INSERT INTO [dbo].[ContentResources]
SELECT [Id], [OwnerId], [NodeId], [Name], [Type], [Order], [CreatedOn], [LastModified], [Resource], [Description], [Visibility]
FROM [dbo].[ProjectNodeResources]
GO

DROP PROCEDURE IF EXISTS [dbo].[ProjectResource_Set]
GO

DROP PROCEDURE IF EXISTS [dbo].[ProjectNodeResource_Set]
GO

DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryVersionResource_Set]
GO

DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryNodeResource_Set]
GO

DROP TABLE [dbo].[LibraryEntryVersionResources]
GO

DROP TABLE [dbo].[LibraryEntryNodeResources]
GO

DROP TABLE [dbo].[ProjectResources]
GO

DROP TABLE [dbo].[ProjectNodeResources]
GO






