DROP TABLE dbo.ProjectApproval
GO

CREATE TABLE [dbo].[ProjectApproval] (
    [Id] nvarchar(100) NOT NULL,
    [ProjectId] nvarchar(100) NOT NULL,
    [ApprovedOn] datetimeoffset NULL,
    [ApprovedBy] nvarchar(100) NULL,
    [IsApproved] bit NULL,
    CONSTRAINT ProjectApproval_PK PRIMARY KEY CLUSTERED ([ProjectId] ASC, [Id] ASC),
    CONSTRAINT ProjectApproval_FK_ProjectId FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects] ([Id]) ON DELETE CASCADE
)
GO

