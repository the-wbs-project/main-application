CREATE TABLE [dbo].[Projects] (
    [Id] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [CreatedBy] nvarchar(100) NOT NULL,
    [CreatedOn] datetimeoffset NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(MAX) NULL,
    [LastModified] datetimeoffset NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [MainNodeView] nvarchar(20) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [Phases] nvarchar(MAX) NULL,
    [Disciplines] nvarchar(MAX) NULL,
    [Roles] nvarchar(MAX) NULL,
    CONSTRAINT Projects_PK PRIMARY KEY CLUSTERED ([Id] ASC),
    INDEX Projects_INDX_OwnerId NONCLUSTERED ([OwnerId] ASC)
)
GO
