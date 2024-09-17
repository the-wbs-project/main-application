
ALTER TABLE [dbo].[ProjectApproval] DROP CONSTRAINT [ProjectApproval_FK_ProjectId]
GO

ALTER TABLE [dbo].[ProjectNodes] DROP CONSTRAINT [ProjectNode_FK_ProjectId]
GO

ALTER TABLE [dbo].[ProjectResources] DROP CONSTRAINT [ProjectResources_FK_Project]
GO

ALTER TABLE [dbo].[ProjectSnapshots] DROP CONSTRAINT [ProjectSnapshots_FK_ProjectId]
GO

SELECT *
INTO #Projects
FROM [dbo].[Projects]
GO

DROP TABLE [dbo].[Projects]
GO

CREATE TABLE [dbo].[Projects]
(
    [Id] nvarchar(100) NOT NULL,
    [RecordId] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [CreatedBy] nvarchar(100) NOT NULL,
    [CreatedOn] datetimeoffset NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(MAX) NULL,
    [LastModified] datetimeoffset NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [MainNodeView] nvarchar(20) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [Disciplines] nvarchar(MAX) NULL,
    [Roles] nvarchar(MAX) NULL,
    [ApprovalStarted] bit NULL,
    [LibraryLink] nvarchar(MAX) NULL,
    CONSTRAINT Projects_PK PRIMARY KEY CLUSTERED ([Id] ASC),
    INDEX Projects_INDX_OwnerId NONCLUSTERED ([OwnerId] ASC)
)
GO

DECLARE @Min INT = 10000
DECLARE @Max INT = 999999

INSERT INTO [dbo].[Projects]
    ([Id], [RecordId], [OwnerId], [CreatedBy], [CreatedOn],[Title],[Description],[LastModified],[Status],[MainNodeView],[Category],[Disciplines],[Roles],[ApprovalStarted],[LibraryLink])
SELECT [Id], 'L-' + RIGHT('0000' + CAST(FLOOR(RAND() * (@Max - @Min) + @Min) AS VARCHAR(10)), 6), [OwnerId], [CreatedBy], [CreatedOn], [Title], [Description], [LastModified], [Status], [MainNodeView], [Category], [Disciplines], [Roles], [ApprovalStarted], [LibraryLink]
FROM #Projects
GO

DROP TABLE #Projects
GO


ALTER TABLE [dbo].[ProjectSnapshots] ADD CONSTRAINT ProjectSnapshots_FK_ProjectId FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects] ([Id]) ON DELETE CASCADE
GO

ALTER TABLE [dbo].[ProjectResources] ADD CONSTRAINT [ProjectResources_FK_Project] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects] ([Id]) ON DELETE CASCADE
GO

ALTER TABLE [dbo].[ProjectNodes] ADD CONSTRAINT ProjectNode_FK_ProjectId FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects] ([Id]) ON DELETE CASCADE
GO

ALTER TABLE [dbo].[ProjectApproval] ADD CONSTRAINT ProjectApproval_FK_ProjectId FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects] ([Id]) ON DELETE CASCADE
GO
